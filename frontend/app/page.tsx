import Banner from './components/Banner/Banner';
import Companies from './components/Companies/Companies';
import Provide from './components/Provide/index';
import Why from './components/Why/index';
import PopularDestinations from './components/popular-destinations/popular-destinations';
import { Test } from './components/Test/test';
export default function Home() {
  return (
    <main>
      <Banner />
      <Test />
      <Companies />
      <Provide />
      <Why />
      <PopularDestinations /> 

    </main>
  )
}
