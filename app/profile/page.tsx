import { createServerSupabaseClient } from '@/lib/server/server';
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Grid,
  Divider,
  Button
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import HomeIcon from '@mui/icons-material/Home';

async function ProfilePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    return <Typography>Error authenticating user: {authError.message}</Typography>;
  }

  if (!authUser) {
    return <Typography>User not authenticated. Please log in.</Typography>;
  }

  // Fetch user data from the 'users' table
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (userDataError) {
    console.error('Error fetching user data:', userDataError);
    return <Typography>Error fetching user data: {userDataError.message}</Typography>;
  }

  if (!userData) {
    return (
      <>
        <Typography>User profile not found. Please complete your profile.</Typography>
        <Button variant="contained" href="/profile/edit" sx={{ mt: 2 }}>
          Complete Profile
        </Button>
      </>
    );
  }

  return (
    <Box sx={{ p: 5, height: '100vh', margin: 'auto' }}>
      <Paper
        sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {userData.username?.[0] || authUser.email?.[0]}
          </Avatar>
          <Typography variant="h4" color="#1f1f1f">Profile</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          <ProfileItem
            icon={<AccountCircleIcon />}
            label="ID"
            value={userData.id}
          />
          <ProfileItem
            icon={<EmailIcon />}
            label="Email"
            value={authUser.email}
          />
          {userData.username && (
            <ProfileItem
              icon={<BadgeIcon />}
              label="Username"
              value={userData.username}
            />
          )}
          <ProfileItem
            icon={<WorkIcon />}
            label="Subscription Tier"
            value={userData.subscription_tier || 'Free'}
          />
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button variant="contained" href="/home/pricing" sx={{ mt: 2 }}>
            Upgrade Plan
          </Button>
          <Button variant="outlined" href="/profile/edit" sx={{ mt: 2 }}>
            Complete Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

function ProfileItem({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ mr: 2, color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography>{value}</Typography>
        </Box>
      </Box>
    </Grid>
  );
}

export default ProfilePage;
