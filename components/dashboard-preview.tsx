import Milestones from "./milestones"
import { List, LayoutGrid, BarChart, Settings, User, Bell, Search } from "lucide-react"

export default function DashboardPreview() {
  return (
    <div className="mt-16 w-full max-w-6xl mx-auto h-[500px] md:h-[600px] lg:h-[700px] bg-[#1A1A1A]/70 rounded-xl p-4 shadow-2xl border border-gray-700 flex flex-col animate-scale-in">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 rounded-md bg-[#84CC16]" />
          <span className="text-lg font-bold text-white">Index</span>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-gray-400" />
          <Bell className="h-5 w-5 text-gray-400" />
          <div className="h-8 w-8 rounded-full bg-gray-600" /> {/* User Avatar Placeholder */}
        </div>
      </div>

      {/* Dashboard Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 min-w-[180px] bg-[#1A1A1A] p-4 border-r border-gray-700 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <LayoutGrid className="h-5 w-5" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <BarChart className="h-5 w-5" />
            <span>Analytics</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <List className="h-5 w-5" />
            <span>Tasks</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Milestones Card - prominently displayed */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-md">
              <h3 className="text-xl font-semibold text-white mb-4">Our Achievements</h3>
              <Milestones />
            </div>

            {/* Placeholder Cards */}
            <div
              className="bg-gray-800 rounded-lg p-6 h-48 border border-gray-700 shadow-md animate-fade-in-up"
              style={{ animationDelay: "1s" }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">AI Solution Progress</h3>
              <div className="h-24 bg-gray-700 rounded-md flex items-center justify-center text-gray-500">
                Chart Placeholder
              </div>
            </div>
            <div
              className="bg-gray-800 rounded-lg p-6 h-48 border border-gray-700 shadow-md animate-fade-in-up"
              style={{ animationDelay: "1.2s" }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Recent Activities</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>- New model deployed (2 hours ago)</li>
                <li>- Report generated (yesterday)</li>
                <li>- User feedback analyzed (3 days ago)</li>
              </ul>
            </div>
            <div
              className="bg-gray-800 rounded-lg p-6 h-48 border border-gray-700 shadow-md animate-fade-in-up"
              style={{ animationDelay: "1.4s" }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>
                  Users: <span className="text-white font-medium">1.2K</span>
                </div>
                <div>
                  Active: <span className="text-white font-medium">800</span>
                </div>
                <div>
                  Projects: <span className="text-white font-medium">50</span>
                </div>
                <div>
                  Revenue: <span className="text-white font-medium">$10M+</span>
                </div>
              </div>
            </div>
            <div
              className="bg-gray-800 rounded-lg p-6 h-48 border border-gray-700 shadow-md animate-fade-in-up"
              style={{ animationDelay: "1.6s" }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">Notifications</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>- New feature available!</li>
                <li>- System update scheduled</li>
                <li>- Billing reminder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
