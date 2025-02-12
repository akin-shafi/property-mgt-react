import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/components/ui/card";

export function PaymentCard({ title, value, valueClassName = "" }) {
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex-row items-center justify-center h-full">
        <div className={` font-bold my-4 ${valueClassName}`}>
          Deposit: {currencyFormatter.format(value?.deposit)}
        </div>
        <div className={` font-bold mb-4 text-red-500`}>
          Balance: {currencyFormatter.format(value?.balance)}
        </div>
      </CardContent>
    </Card>
  );
}
