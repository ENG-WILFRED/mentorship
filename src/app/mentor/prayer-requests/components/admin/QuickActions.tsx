import Button from '../Button'
import {
  UserPlus,
  Download,
  Filter,
  Calendar,
} from "lucide-react";

interface QuickActionsProps {
  handleExportData: () => void;
}

export default function QuickActions({handleExportData}: QuickActionsProps) {
  return (
     <div className="bg-linear-to-br from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* <Button
            type='button' 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Mentor
          </Button> */}
          <Button
            type='button' 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter Requests
          </Button>
          <Button
            type='button' 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
          <Button
            type='button' 
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
  )
}
