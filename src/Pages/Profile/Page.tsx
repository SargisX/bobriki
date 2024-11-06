import { Profile } from "../../components/profile/profile"
import { User } from "../../components/users_comp/types";
interface ProfileProps {
  user: User | null;
  setUser: (user: User | null) => void;
}
export const ProfilePage = ({user,setUser}:ProfileProps) => {
  return (
    <div>
        <Profile user={user} setUser={setUser}/>
    </div>
  )
}
