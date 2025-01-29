"use client"
import React, {useState} from 'react'
import { Button } from '../../components/ui/button'
import EmptyState from './_components/EmptyState.jsx'
import Link from 'next/link';

function Dashboard() {
    const [videoList, setVideoList] = useState([]);

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='font-bold text-2xl text-primary'>DashBoard</h2>
                <Link href="/dashboard/create-new">
                    <Button>+ Create New</Button>
                </Link>
            </div>
            {/* Empty list */}
            {videoList?.length == 0 && <div>
                <EmptyState />
            </div>}

            {/* List of videos
            <VideoList videoList={videoList} /> */}
        </div>
    )
}

export default Dashboard