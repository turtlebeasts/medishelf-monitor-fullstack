import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from medicines.models import MedicinePost
from openai import OpenAI

class GenerateInstructionsView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    def post(self, request, post_id:int):
        try: post=MedicinePost.objects.get(pk=post_id)
        except MedicinePost.DoesNotExist: return Response({"detail":"Post not found."}, status=404)
        if post.instructions: return Response({"instructions": post.instructions})
        client=OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        prompt=(f"Provide brief, safety-first info for:\n"
                f"Name: {post.name}\nDescription: {post.description}\n"
                f"Sections: Overview, Typical Use, Storage, Warnings, When to Seek Help.\n"
                f"Disclaimer: Always consult a licensed healthcare professional.")
        try:
            resp=client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role":"system","content":"You write short, safety-first medicine info. No diagnoses or dosing."},
                    {"role":"user","content":prompt}],
                temperature=0.2, max_tokens=500)
            text=resp.choices[0].message.content.strip()
        except Exception as e:
            return Response({"detail":f"AI error: {e}"}, status=500)
        post.instructions=text; post.save(update_fields=["instructions"])
        return Response({"instructions":text}, status=status.HTTP_201_CREATED)
