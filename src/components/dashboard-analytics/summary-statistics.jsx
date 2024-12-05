import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/CardComponent";
import {
  Bed,
  Coffee,
  DoorOpen,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  ArrowLeftRight,
} from "lucide-react";

function StatItem({ title, value, icon }) {
  return (
    <div className="border rounded-lg divide-y divide-gray-200 bg-white">
      <div className="flex items-center p-4">
        <div className="grid grid-cols-[1fr_2fr] items-center gap-4 w-full">
          <p className="text-sm font-medium text-gray-600 flex items-center">
            {icon} <span className="ml-2">{title}</span>
          </p>
          <p className="text-lg font-bold text-gray-800  text-end">{value}</p>
        </div>
      </div>

      {/* Repeat for additional list items */}
    </div>
  );
}

export function SummaryStatistics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Room Statistics</h3>
          <div className="grid gap-2">
            <StatItem
              title="Sold Rooms"
              value={27}
              icon={<Bed className="h-4 w-4" />}
            />
            <StatItem
              title="Complementary Rooms"
              value={1}
              icon={<Coffee className="h-4 w-4" />}
            />
            <StatItem
              title="Expected Check-outs"
              value={1}
              icon={<DoorOpen className="h-4 w-4" />}
            />
            <StatItem
              title="DayUse Rooms"
              value={0}
              icon={<Bed className="h-4 w-4" />}
            />
            <StatItem
              title="Pax (Adult/Child)"
              value="56/6"
              icon={<Users className="h-4 w-4" />}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Settlement Information</h3>
          <div className="grid gap-2">
            <StatItem
              title="Cash Collection"
              value="$1,437.29"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatItem
              title="Cheque Collection"
              value="$0.00"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatItem
              title="Card Collection"
              value="$4,501.43"
              icon={<CreditCard className="h-4 w-4" />}
            />
            <StatItem
              title="Account Posting"
              value="$2,883.71"
              icon={<FileText className="h-4 w-4" />}
            />
            <StatItem
              title="Folio Transfer"
              value="$512.35"
              icon={<ArrowLeftRight className="h-4 w-4" />}
            />
            <StatItem
              title="Payment on Hold"
              value="$0.00"
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatItem
              title="Today's Void"
              value="$0.00"
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
