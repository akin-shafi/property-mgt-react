import Layout from "@/components/utils/Layout";
import { ReservationForm } from "@/components/forms/reservation-form";

export default function ReservationPage() {
  return (
    <Layout>
      <div className="py-1">
        <ReservationForm />
      </div>
    </Layout>
  );
}
