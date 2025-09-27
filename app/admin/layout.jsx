import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "AIna. - Admin",
    description: "AIna. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
