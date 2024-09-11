import React, { useRef, useEffect } from "react";
import JAZZ from "@metamask/jazzicon";
import usePfp from "../../hooks/usePfp";
import userAvatar from "../../../public/user-avatar.png";
import assistantAvatar from "../../../public/assistant-avatar.png";

export default function Jazzicon({ size = 10, user, role }) {
  const { pfp } = usePfp();
  const divRef = useRef(null);
  const seed = user?.uid
    ? toPseudoRandomInteger(user.uid)
    : Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    if (!divRef.current || (role === "user" && pfp)) return;

    const result = JAZZ(size, seed);
    // divRef.current.appendChild(result);
  }, [pfp, role, seed, size]);

  return (
    <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
      {/* <div ref={divRef} /> */}
      <img
        src={role === "user" ? userAvatar : assistantAvatar}
        alt="默认头像"
      />
      {role === "user" && pfp && (
        <img
          src={pfp}
          alt="头像"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-full bg-white"
        />
      )}
    </div>
  );
}

function toPseudoRandomInteger(uidString = "") {
  return uidString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}
