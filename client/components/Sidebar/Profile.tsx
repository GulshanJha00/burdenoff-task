import { LogOut, Settings, User } from 'lucide-react'

const Profile = () => {
  return (
    <div className="mt-auto space-y-1">
            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>

            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <User size={20} />
              <span className="font-medium">Profile</span>
            </button>

            <button className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-red-400">
              <LogOut size={20} />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
  )
}

export default Profile
