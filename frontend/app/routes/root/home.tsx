import React from 'react'
import type { Route } from '../../+types/root';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@radix-ui/react-avatar';
import { Link } from 'react-router';


export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskHub" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Homepage = () => {
  return (
    <div className='flex w-full h-screen justify-center items-center gap-4'>
      <Link to="/sign-in">
        <Button className="bg-blue-500 text-white">Login</Button>
      </Link>
      <Link to="/sign-up">
        <Button variant="outline" className="bg-blue-500 text-white">Sign Up</Button>
      </Link>
      
    </div>
  )
}

export default Homepage