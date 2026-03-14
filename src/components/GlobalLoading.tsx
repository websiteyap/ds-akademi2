import React from "react";

export default function GlobalLoading() {
  return (
    <div className="global-loading-screen">
      <div className="global-loading-logo-wrap">
        <img 
          src="/logo.png" 
          alt="Yükleniyor..." 
          className="global-loading-logo" 
        />
        <div className="global-loading-spinner" />
      </div>
    </div>
  );
}
