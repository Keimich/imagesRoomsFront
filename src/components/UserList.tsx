import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { ChevronRight } from 'lucide-react';

interface UserListProps {
  users: User[];
}

function UserList({ users }: UserListProps): React.ReactElement {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-1/2 left-0 -translate-y-1/2 z-50 rounded-l-none">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Active Users ({users.length})</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="truncate">
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UserList;
