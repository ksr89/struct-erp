export const updateProfile = async (profile: { firstName: string, lastName: string, password: string, role: string }) => {
  // Simulate an API call to update the user's profile.
  console.log("Profile updated:", profile);
  return Promise.resolve(profile);
};
