const searchParams = useSearchParams();
const pathname = usePathname();
const { replace } = useRouter();

const [searchTerm, setSearchTerm] = useState({
  destination: destination || "Puglia",
  checkin: checkin,
  checkout: checkout,
});

const [allowSearch, setAllowSearch] = useState(true);

const handleInputs = (e) => {
  const name = e.target.name;
  const value = e.target.value;

  const state = { ...searchTerm, [name]: value };

  if (new Date(state.checkin).getTime() > new Date(state.checkout).getTime()) {
    setAllowSearch(false);
  } else {
    setAllowSearch(true);
  }
  setSearchTerm(state);
};

function doSearch(event) {
  const params = new URLSearchParams(searchParams);

  params.set("destination", searchTerm?.destination || "all");
  if (searchTerm?.checkin && searchTerm?.checkout) {
    params.set("checkin", searchTerm?.checkin);
    params.set("checkout", searchTerm?.checkout);
  }

  if (pathname.includes("hotels")) {
    replace(`${pathname}?${params.toString()}`);
  } else {
    replace(`${pathname}hotels?${params.toString()}`);
  }
}
<div className="flex justify-center items-center h-64">
  <ClipLoader speedMultiplier={0.5} size={50} color="#4fa94d" />
</div>;
JSON.stringify({
  items: [
    {
      product: product._id,
      quantity: quantity,
      price: product.price * quantity,
      unit: product.unit,
    },
  ],
  totalAmount: product.price * quantity,
  shippingCost: 50,
  serviceFee: 50,
});
