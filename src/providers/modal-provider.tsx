'use client'

import { PricesList, TicketDetails } from "@/lib/types"
import { Agency, Contact, Plan, User } from "@prisma/client"
import { createContext, useContext, useEffect, useState } from "react"

interface ModalProviderProps {
    children: React.ReactNode
}

export type ModalData = {
    user?: User
    agency?: Agency
    ticket?: TicketDetails[0]
    contact?: Contact
    plans?: {
        defaultPriceId: Plan
        plans: PricesList['data']
    }
}

type ModalContextType = {
    data: ModalData
    isOpen: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void
    setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
    data: {},
    isOpen: false,
     
   setOpen: () => {},
    setClose: () => { },
})

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<ModalData>({})
    const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setOpen = async (modal: React.ReactNode, fetchData?: () => Promise<any>) => {
    if (modal) {
        if (fetchData) {
            const fetched = await fetchData();
            setData({ ...data, ...(fetched || {}) });
        }
        setShowingModal(modal);
        setIsOpen(true);
    }
};

const setClose = () => {
    setIsOpen(false)
    setData({})
}
if(!isMounted) return null

return (
    <ModalContext.Provider value={{ data, isOpen, setOpen, setClose }}>
        {children}
        {showingModal}
    </ModalContext.Provider>

)

    
}

export const useModal = () =>{
    const context = useContext(ModalContext)
    if(!context) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}

export default ModalProvider