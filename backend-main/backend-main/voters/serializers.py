from rest_framework import serializers
from .models import Voter

class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = '__all__'  # You can also specify fields explicitly, e.g., ['voter_id', 'full_name', ...]