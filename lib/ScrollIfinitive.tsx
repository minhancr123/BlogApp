import { useRef } from "react";
import { useInView } from "react-intersection-observer";

export interface ScrollIfnitive extends React.PropsWithChildren {
  onBottomView : () => void;
  className? : string;
}

export const ScrollIfnitiveComponent : React.FC<ScrollIfnitive> = ({onBottomView , className , children }) => {
    const {ref}  = useInView({
        rootMargin : "200px",
        onChange(InView){
            if(InView){
                onBottomView();
            }
        }
    });
    return (
       <div className={className}>
        {children}
        <div ref={ref}></div>
       </div>
    )
}