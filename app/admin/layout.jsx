import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "aiyna. - Admin",
    description: "aiyna. - Admin",
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
