import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function OnboardingLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Sign out without redirecting
    router.push("/admin"); // Redirect to the sign-in page or any other page
  };
  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center border">
        <img src="/assets/final-animation.gif" alt="complete animation" />

        <h3 className="md:text-[32px] font-semibold text-[25px] text-primary">
          Congratulations! 🎊
        </h3>
        <p className="md:text-[24px] font-normal text-[19px] text-[#475467]">
          Your account creation is complete
        </p>
        <p className="md:text-[14px] font-normal text-[14px] text-[#475467]">
          You can still edit any of the data you provided earlier from the settings page.
        </p>

        <button
          onClick={handleLogout} // Replace `signOut` with your actual logout function
          className="mt-6 px-6 py-3 text-white bg-primary rounded-md text-[16px] font-semibold hover:bg-primary-dark"
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
}
