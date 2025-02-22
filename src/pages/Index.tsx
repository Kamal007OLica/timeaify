import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, Focus, Lock, History } from "lucide-react";
import { Onboarding } from "@/components/Onboarding";
import { ThemeToggle } from "@/components/ThemeToggle";

interface FocusSession {
  startTime: Date;
  endTime?: Date;
  duration: number;
  blockedAttempts: { app: string; timestamp: Date }[];
}

const Index = () => {
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusProgress, setFocusProgress] = useState(0);
  const [focusDuration, setFocusDuration] = useState(25); // minutes
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
  const [newBlockItem, setNewBlockItem] = useState("");
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast({
      title: "Welcome to Timeaify!",
      description: "Press Ctrl+F anytime to start a focus session.",
    });
  };

  const handleLoginSuccess = (response: any) => {
    setIsAuthenticated(true);
    toast({
      title: "Successfully logged in",
      description: "Welcome to Timeaify!",
    });
  };

  const toggleFocusMode = () => {
    if (!isFocusMode) {
      const newSession: FocusSession = {
        startTime: new Date(),
        duration: 0,
        blockedAttempts: [],
      };
      setCurrentSession(newSession);
      setFocusProgress(0);
      setIsFocusMode(true);
      toast({
        title: "Focus Mode Activated",
        description: `Starting ${focusDuration} minute focus session`,
      });
    } else {
      endFocusSession();
    }
  };

  const endFocusSession = () => {
    if (currentSession) {
      const endTime = new Date();
      const duration = (endTime.getTime() - currentSession.startTime.getTime()) / 1000 / 60; // in minutes
      const completedSession: FocusSession = {
        ...currentSession,
        endTime,
        duration,
      };
      setFocusSessions([...focusSessions, completedSession]);
      setCurrentSession(null);
    }
    setIsFocusMode(false);
    setFocusProgress(0);
    toast({
      title: "Focus Mode Deactivated",
      description: "Great work on staying focused!",
    });
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
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault(); // Prevent default browser find
        toggleFocusMode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFocusMode]);

  useEffect(() => {
    let interval: number;
    if (isFocusMode) {
      interval = window.setInterval(() => {
        setFocusProgress((prev) => {
          const newProgress = prev + (100 / (focusDuration * 60));
          if (newProgress >= 100) {
            clearInterval(interval);
            endFocusSession();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusMode, focusDuration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
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

      <div className="container mx-auto p-4 h-screen">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            timeaify
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isAuthenticated && (
              <Button 
                onClick={() => {
                  toast({
                    title: "Google Sign-In Temporarily Disabled",
                    description: "Please configure your Google Client ID first",
                  });
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl p-6 border-0 dark:border dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Focus className="h-5 w-5 text-purple-500" />
                Focus Mode
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Focus Mode Shortcut",
                    description: "Press Ctrl+F to toggle focus mode from anywhere",
                  });
                }}
              >
                Ctrl+F
              </Button>
            </div>

            <div className="space-y-4">
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
                  <Timer className="h-5 w-5 text-purple-500" />
                  <Input
                    type="number"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={120}
                  />
                  <span className="text-sm text-gray-500">min</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">Block List</h3>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter app name or website URL"
                    value={newBlockItem}
                    onChange={(e) => setNewBlockItem(e.target.value)}
                  />
                  <Button onClick={addBlockItem}>Add</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl p-6 border-0 dark:border dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-purple-500" />
              <h2 className="text-xl font-semibold">Focus Sessions</h2>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto space-y-2">
              {focusSessions.map((session, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm font-medium">
                    Session {focusSessions.length - index}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {Math.round(session.duration)} minutes
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start: {session.startTime.toLocaleTimeString()}
                  </p>
                  {session.endTime && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      End: {session.endTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 shadow-xl rounded-xl p-6 border-0 dark:border dark:border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4">Top Applications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <h3 className="font-medium text-purple-700 dark:text-purple-300">VS Code</h3>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">2h 15m</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">Chrome</h3>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">1h 45m</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
