import { useRouter } from 'next/router';
import { useEffect } from 'react';

// This page handles the redirect from Twitter OAuth and stores the access token in localStorage (or you can call your backend to store it securely)
const TwitterOAuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (!code) {
        router.replace('/profile?twitter=error');
        return;
      }
      // Call backend to exchange code for access token
      const res = await fetch(`/api/twitter/callback?code=${code}`);
      const data = await res.json();
      if (data.success && data.accessToken && data.twitterHandle) {
        // Store in localStorage (for demo; in production, send to backend to associate with user)
        localStorage.setItem('twitter_access_token', data.accessToken);
        localStorage.setItem('twitter_handle', data.twitterHandle);
        router.replace('/profile?twitter=connected');
      } else {
        router.replace('/profile?twitter=error');
      }
    };
    handleOAuth();
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center text-primary text-xl">Connecting Twitter...</div>;
};

export default TwitterOAuthCallback;
