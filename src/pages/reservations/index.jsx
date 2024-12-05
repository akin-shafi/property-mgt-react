import ReservationLayout from "../../components/utils/ReservationLayout";
import { ReservationForm } from "../../components/forms/reservation-form";

export default function ReservationPage() {
  return (
    <ReservationLayout>
      <div className="py-1">
        <ReservationForm />
      </div>
    </ReservationLayout>
  );
}
