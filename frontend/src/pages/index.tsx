import Header from '../components/Header';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

export default function Index() {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex-1">
          <Upload />
        </main>
      <Footer />
    </div>
    </>
  )
}