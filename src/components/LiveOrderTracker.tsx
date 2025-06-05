import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // Example usage for visual tracking
import { CheckCircle, Clock,Truck, PackageCheck } from 'lucide-react'; // Example icons

type OrderStatus = "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

interface LiveOrderTrackerProps {
  orderId: string;
  status: OrderStatus;
  estimatedDeliveryTime?: string; // e.g., "5:30 PM" or "25 minutes"
  statusSteps?: { status: OrderStatus; label: string; icon: React.ElementType }[];
}

const defaultStatusSteps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: "CONFIRMED", label: "Order Confirmed", icon: CheckCircle },
  { status: "PREPARING", label: "Preparing Food", icon: Clock },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: PackageCheck },
];


const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  orderId,
  status,
  estimatedDeliveryTime,
  statusSteps = defaultStatusSteps,
}) => {
  console.log(`Rendering LiveOrderTracker for order ID: ${orderId}, Status: ${status}`);

  const currentStepIndex = statusSteps.findIndex(step => step.status === status);
  const progressPercentage = currentStepIndex >= 0 && status !== "CANCELLED"
    ? ((currentStepIndex + 1) / (statusSteps.filter(s => s.status !== "CANCELLED").length)) * 100
    : (status === "DELIVERED" ? 100 : 0);

  const getStepClass = (stepIndex: number) => {
    if (status === "CANCELLED") return "text-gray-400";
    if (stepIndex < currentStepIndex) return "text-green-600";
    if (stepIndex === currentStepIndex) return "text-green-700 font-semibold";
    return "text-gray-400";
  };
  
  const getIconColor = (stepIndex: number) => {
    if (status === "CANCELLED") return "text-gray-400";
    if (stepIndex <= currentStepIndex) return "text-green-600";
    return "text-gray-400";
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Order Status: #{orderId.substring(0,8)}...</CardTitle>
        {estimatedDeliveryTime && status !== "DELIVERED" && status !== "CANCELLED" && (
          <p className="text-sm text-gray-600">Estimated Delivery: {estimatedDeliveryTime}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "CANCELLED" ? (
            <div className="text-center py-4">
                <p className="text-xl font-semibold text-red-600">Order Cancelled</p>
            </div>
        ) : (
            <>
                <Progress value={progressPercentage} aria-label={`Order progress: ${status}`} className="h-2" />
                <div className="flex justify-between pt-2">
                {statusSteps.filter(s => s.status !== "CANCELLED").map((step, index) => (
                    <div key={step.status} className={`flex flex-col items-center text-center w-1/${statusSteps.length}`}>
                        <step.icon className={`h-6 w-6 mb-1 ${getIconColor(index)}`} />
                        <span className={`text-xs ${getStepClass(index)}`}>{step.label}</span>
                    </div>
                ))}
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveOrderTracker;