import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/components/ui/card";

export function KPICard({ title, value, valueClassName = "" }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
