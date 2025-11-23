import MainLayout from "../../components/layout/MainLayout";

const BoardsList = () => {
  return (
    <MainLayout>
      <div className="text-white">
        <h1 className="text-3xl font-bold gradient-title">Your Boards</h1>

        <p className="text-gray-400 mt-2">
          Manage all collaborative Kanban boards in one place.
        </p>

        <div className="mt-10 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-gray-300 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
          (Board creation and listing will come in Frontend Day 2)
        </div>
      </div>
    </MainLayout>
  );
};

export default BoardsList;
