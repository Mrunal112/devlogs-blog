import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
    
export const Signin = () => {
  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center min-h-screen lg:min-h-0">
        <Auth type="signin" />
      </div>
      <div className="invisible lg:visible">
        <Quote type="signin" />
      </div>
    </div>
  );
};
