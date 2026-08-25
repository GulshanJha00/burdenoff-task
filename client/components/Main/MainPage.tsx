interface MainPageProps {
  selectedPage: number;
}

const MainPage = ({ selectedPage }: MainPageProps) => {
  if (selectedPage === 0) {
    return <h1>Daily Page</h1>;
  }

  if (selectedPage === 1) {
    return <h1>Weekly Page</h1>;
  }

  if (selectedPage === 2) {
    return <h1>Monthly Page</h1>;
  }

  return null;
};

export default MainPage;