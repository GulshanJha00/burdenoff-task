import Daily from "../Progress/Daily";
import Monthly from "../Progress/Monthly";
import Weekly from "../Progress/Weekly";

interface MainPageProps {
  selectedPage: number;
}

const MainPage = ({ selectedPage }: MainPageProps) => {
    const pages = [
        <Daily/>,
        <Weekly/>,
        <Monthly/>
    ]

  return pages[selectedPage];
};

export default MainPage;