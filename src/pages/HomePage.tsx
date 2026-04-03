import { Link } from "react-router";
import bgImage from "../assets/image1.png";

const menus = [
  {
    name: "Customer",
    path: "/customer",
    desc: "Order your favorite meals",
    icon: "🍔", 
    color: "bg-yellow-400"
  },
  {
    name: "Admin",
    path: "/login",
    desc: "Manage products and store",
    icon: "⚙️",
    color: "bg-gray-200"
  },
  {
    name: "Kitchen",
    path: "/login",
    desc: "Prepare incoming orders",
    icon: "🍳",
    color: "bg-gray-200"
  }
];

export default function HomePage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen flex flex-col">

      {/* Bg Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[0px]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
          Welcome to <span className="text-yellow-400">McDonald's</span>
        </h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-12">
          A kinetic dining experience crafted just for you. How would you like to access the system today?
        </p>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {menus.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="group bg-white rounded-3xl p-8 flex flex-col items-center transition-transform hover:scale-105 shadow-xl"
            >
              <div className={`${item.color} w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner`}>
                {item.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}