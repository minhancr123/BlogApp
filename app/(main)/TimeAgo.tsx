import { useEffect , useState } from "react";
import { FormatDateTime } from "@/lib/utils";

interface TimeAgoProps{
    timestamp : Date,
    intervalMS? : number
}

export const TimeAgo = ({timestamp , intervalMS = 6000} : TimeAgoProps) =>{
    const compute = () => FormatDateTime(timestamp);

    const [label , setlabel ]= useState<String>(compute);

    useEffect(() => {
        setlabel(compute);

        const id = setInterval(() => {
            setlabel(compute());
        }, intervalMS);
        
        return () => clearInterval(id);
    },  [timestamp , intervalMS])

    return <span>{label}</span>;
}