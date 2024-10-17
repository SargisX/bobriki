import { Desktop } from "../../components/schedule_comp.tsx/desktop"
import { Mobile } from "../../components/schedule_comp.tsx/mobile"
import "../../components/schedule_comp.tsx/schedule.css"
export const Schedule = () => {
    return (
        <div>
            <Desktop/>
            <Mobile/>
        </div>
    )
}
