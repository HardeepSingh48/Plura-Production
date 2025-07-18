import InfoBar from '@/components/global/infobar';
import Sidebar from '@/components/sidebar';
import Unauthorized from '@/components/unauthorized';
import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    children: React.ReactNode;
    params: Promise<{ subaccountId: string }>
}

const SubaccountLayout = async ({ children, params }: Props) => {
    const resolvedParams = await params

    const agencyId = await verifyAndAcceptInvitation();
    if (!agencyId) return <Unauthorized />
    const user = await currentUser();
    if (!user) {
        return redirect('/')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let notifications: any = []

    if (!user.privateMetadata.role) {
        return <Unauthorized />
    } else {
        const allPermissions = await getAuthUserDetails()
        const hasPermission = allPermissions?.Permissions.find(
            (permissions) =>
                permissions.access && permissions.subAccountId === resolvedParams.subaccountId
        )
        if (!hasPermission) {
            return <Unauthorized />
        }

        const allNotifications = await getNotificationAndUser(agencyId)

        if (
            user.privateMetadata.role === 'AGENCY_ADMIN' ||
            user.privateMetadata.role === 'AGENCY_OWNER'
        ) {
            notifications = allNotifications
        } else {
            const filteredNoti = allNotifications?.filter(
                (item) => item.subAccountId === resolvedParams.subaccountId
            )
            if (filteredNoti) notifications = filteredNoti
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar
                id={resolvedParams.subaccountId}
                type="subaccount"
            />

            <div className="md:pl-[300px]">
                <InfoBar
                    notifications={notifications}
                    role={user.privateMetadata.role as Role}
                    subAccountId={resolvedParams.subaccountId as string}
                />
                <div className="relative">{children}</div>
            </div>
        </div>
    )
}
export default SubaccountLayout