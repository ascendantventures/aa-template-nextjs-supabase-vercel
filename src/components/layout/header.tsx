"use client";

import React from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header(): React.ReactElement {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <div className="flex items-center gap-2">
              <Avatar
                name={session.user.name ?? session.user.email}
                size="sm"
              />
              <span className="text-sm text-gray-700">
                {session.user.name ?? session.user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              data-testid="sign-out-button"
            >
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
