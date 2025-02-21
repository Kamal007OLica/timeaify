
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [timeData, setTimeData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mockTimeData = [
    { time: '09:00', productivity: 65 },
    { time: '10:00', productivity: 80 },
    { time: '11:00', productivity: 75 },
    { time: '12:00', productivity: 85 },
    { time: '13:00', productivity: 70 },
    { time: '14:00', productivity: 90 },
    { time: '15:00', productivity: 85 },
  ];

  const handleLoginSuccess = (response: any) => {
    setIsAuthenticated(true);
    toast({
      title: "Successfully logged in",
      description: "Welcome to Timeaify!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              timeaify
            </h1>
            {!isAuthenticated && (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  toast({
                    title: "Login failed",
                    description: "Please try again",
                    variant: "destructive",
                  });
                }}
              />
            )}
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline Section */}
            <Card className="col-span-2 p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Productivity Timeline
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={mockTimeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="productivity"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Spotify Section */}
            <Card className="p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Now Playing
              </h2>
              <div className="w-full">
                <iframe
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j"
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-lg"
                ></iframe>
              </div>
            </Card>

            {/* Activity Summary */}
            <Card className="col-span-2 p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Top Applications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="font-medium text-purple-700 dark:text-purple-300">VS Code</h3>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2h 15m</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">Chrome</h3>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">1h 45m</p>
                </div>
              </div>
            </Card>

            {/* Spotify Controls */}
            <Card className="p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Quick Controls
              </h2>
              <div className="flex flex-col gap-2">
                <Button className="w-full" variant="outline">
                  Previous Track
                </Button>
                <Button className="w-full" variant="outline">
                  Next Track
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
