import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "AIna. - Store Dashboard",
    description: "AIna. - Store Dashboard",
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
