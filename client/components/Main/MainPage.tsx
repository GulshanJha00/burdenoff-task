import Daily from "../Progress/Daily";
import Weekly from "../Progress/Weekly";

interface MainPageProps {
  selectedPage: number;
}

const MainPage = ({ selectedPage }: MainPageProps) => {
    const pages = [
        <Daily/>,
        <Weekly/>,
    ]

  return pages[selectedPage];
};

export default MainPage;