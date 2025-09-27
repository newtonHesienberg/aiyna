import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "aiyna. - Store Dashboard",
    description: "aiyna. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
