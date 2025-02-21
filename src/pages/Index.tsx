
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, Focus, Lock } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [timeData, setTimeData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusProgress, setFocusProgress] = useState(0);
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
  const [newBlockItem, setNewBlockItem] = useState("");

  const mockTimeData = [
    { time: '09:00', productivity: 65, activity: 'Coding', duration: 55 },
    { time: '10:00', productivity: 80, activity: 'Meeting', duration: 45 },
    { time: '11:00', productivity: 75, activity: 'Research', duration: 35 },
    { time: '12:00', productivity: 85, activity: 'Documentation', duration: 60 },
    { time: '13:00', productivity: 70, activity: 'Break', duration: 15 },
    { time: '14:00', productivity: 90, activity: 'Development', duration: 50 },
    { time: '15:00', productivity: 85, activity: 'Code Review', duration: 40 },
  ];

  const handleLoginSuccess = (response: any) => {
    setIsAuthenticated(true);
    toast({
      title: "Successfully logged in",
      description: "Welcome to Timeaify!",
    });
  };

  const toggleFocusMode = () => {
    if (!isFocusMode) {
      setFocusProgress(0);
      setIsFocusMode(true);
      toast({
        title: "Focus Mode Activated",
        description: `Starting ${focusDuration} minute focus session`,
      });
    } else {
      setIsFocusMode(false);
      setFocusProgress(0);
      toast({
        title: "Focus Mode Deactivated",
        description: "Great work on staying focused!",
      });
    }
  };

  const addBlockItem = () => {
    if (newBlockItem.includes('.')) {
      setBlockedWebsites([...blockedWebsites, newBlockItem]);
    } else {
      setBlockedApps([...blockedApps, newBlockItem]);
    }
    setNewBlockItem("");
    toast({
      title: "Item Blocked",
      description: `Added ${newBlockItem} to blocklist`,
    });
  };

  useEffect(() => {
    let interval: number;
    if (isFocusMode) {
      interval = window.setInterval(() => {
        setFocusProgress((prev) => {
          const newProgress = prev + (100 / (focusDuration * 60));
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsFocusMode(false);
            toast({
              title: "Focus Session Complete!",
              description: "Well done on completing your focus session.",
            });
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusMode, focusDuration, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {isFocusMode && (
        <div className="fixed top-0 left-0 w-full z-50 px-4 py-2 bg-gray-900/80 backdrop-blur-sm hover:bg-gray-900/90 transition-all duration-200">
          <div className="max-w-md mx-auto">
            <Progress value={focusProgress} className="h-2" />
            <p className="text-white text-sm mt-1 text-center">
              {Math.floor(focusProgress)}% Complete - Stay focused!
            </p>
          </div>
        </div>
      )}

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

          {/* Focus Mode Controls */}
          <Card className="p-6 backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Focus className="h-5 w-5" />
                Focus Mode Settings
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isFocusMode}
                    onCheckedChange={toggleFocusMode}
                    id="focus-mode"
                  />
                  <Label htmlFor="focus-mode">Enable Focus Mode</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  <Input
                    type="number"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={120}
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5" />
                  <h3 className="text 0 font-semibold">Block Apps & Websites</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter app name or website URL"
                    value={newBlockItem}
                    onChange={(e) => setNewBlockItem(e.target.value)}
                  />
                  <Button onClick={addBlockItem}>Add</Button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Blocked Apps</h4>
                    <ul className="space-y-1">
                      {blockedApps.map((app) => (
                        <li key={app} className="text-sm text-gray-600 dark:text-gray-400">
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Blocked Websites</h4>
                    <ul className="space-y-1">
                      {blockedWebsites.map((site) => (
                        <li key={site} className="text-sm text-gray-600 dark:text-gray-400">
                          {site}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

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
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow-lg">
                              <p className="font-medium">{data.activity}</p>
                              <p>Time: {data.time}</p>
                              <p>Duration: {data.duration}min</p>
                              <p>Productivity: {data.productivity}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
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

