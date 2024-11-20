import OnboardingNav from './OnboardingNav';
import TopNav from '../onboarding/TopNav';
import { Outlet } from 'react-router-dom'; // Import Outlet

const OnboardingLayout = () => (
  <div>
    <TopNav />
    <OnboardingNav />
    <main>
      <Outlet /> {/* Render nested routes here */}
    </main>
  </div>
);

export default OnboardingLayout;
