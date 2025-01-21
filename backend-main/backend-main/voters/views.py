from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Voter
from .serializers import VoterSerializer

# POST: Create a new voter
class VoterCreateView(CreateAPIView):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can create voters

# GET: Retrieve a specific voter by ID
class VoterRetrieveView(RetrieveAPIView):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can retrieve voters

# PATCH: Update a specific voter by ID
class VoterUpdateView(UpdateAPIView):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can update voters

# DELETE: Delete a specific voter by ID
class VoterDeleteView(DestroyAPIView):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can delete voters

# GET: List all voters (for Voter Roll)
class VoterListView(ListAPIView):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can list voters

# GET: List only the voter's object associated with the authenticated user
class VoterListByUserView(ListAPIView):
    serializer_class = VoterSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def get_queryset(self):
        # Filter the queryset to return only the voter associated with the authenticated user
        return Voter.objects.filter(userid=self.request.user)