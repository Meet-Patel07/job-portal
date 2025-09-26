import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20">
      <img width={160} className="cursor-pointer" src={assets.logo} alt="" />
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden cursor-pointer">
        Copyright @job-portal | All right reserved.
      </p>
      <div className="flex gap-2.5">
        <img
          width={38}
          className="cursor-pointer"
          src={assets.facebook_icon}
          alt=""
        />
        <img
          width={38}
          className="cursor-pointer"
          src={assets.twitter_icon}
          alt=""
        />
        <img
          width={38}
          className="cursor-pointer"
          src={assets.instagram_icon}
          alt=""
        />
      </div>
    </div>
  );
}

export default Footer;
