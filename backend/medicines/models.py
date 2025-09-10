from django.db import models; from django.contrib.auth.models import User

class MedicinePost(models.Model):
    name=models.CharField(max_length=200)
    description=models.TextField()
    price=models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date=models.DateField()
    instructions=models.TextField(blank=True,null=True) # AI cache
    author=models.ForeignKey(User,on_delete=models.CASCADE,related_name="medicines")
    created=models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.name} by {self.author.username}"
