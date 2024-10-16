interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="w-full h-full flex">
        <div className="fixed top-0 left-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto">

        </div>

        <div className="lg:pl-[264px]">
          <div className="">
            <div className="mx-auto max-w-screen-2xl h-full"></div>
            <main className="h-full px-6 py-8 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
