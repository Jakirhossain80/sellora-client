import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams || {})) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function buildPageItems(currentPage, totalPages) {
  if (!totalPages || totalPages <= 1) return [1];

  const siblings = 1;
  const items = [];

  const left = Math.max(1, currentPage - siblings);
  const right = Math.min(totalPages, currentPage + siblings);

  items.push(1);

  if (left > 2) items.push("...");

  for (let p = left; p <= right; p++) {
    if (p !== 1 && p !== totalPages) items.push(p);
  }

  if (right < totalPages - 1) items.push("...");

  if (totalPages !== 1) items.push(totalPages);

  return items.filter((v, i, arr) => arr.indexOf(v) === i);
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, pagination } = useSelector(
    (state) => state.shopProducts
  );
   
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 8;

  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // ✅ New: go-to-page input state
  const [gotoValue, setGotoValue] = useState("");

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
    setPage(1);
    setGotoValue("");
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    setPage(1);
    setGotoValue("");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setPage(1);
    setGotoValue("");
  }, [categorySearchParam]);

  useEffect(() => {
    const createQueryString = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(createQueryString));
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
          page,
          limit,
        })
      );
    }
  }, [dispatch, sort, filters, page]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const totalPages = pagination?.totalPages || 0;
  const currentPage = pagination?.currentPage || page;

  useEffect(() => {
    if (pagination?.currentPage && pagination.currentPage !== page) {
      setPage(pagination.currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination?.currentPage]);

  const canPrev = currentPage > 1;
  const canNext =
    typeof pagination?.hasNextPage === "boolean"
      ? pagination.hasNextPage
      : productList?.length === limit;

  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  function goToPage(nextPage) {
    if (!nextPage || nextPage === "..." || nextPage === currentPage) return;

    // ✅ If totalPages is known, clamp safely
    let finalPage = Number(nextPage);
    if (Number.isNaN(finalPage)) return;

    if (totalPages > 0) {
      finalPage = Math.min(Math.max(finalPage, 1), totalPages);
    } else {
      finalPage = Math.max(finalPage, 1);
    }

    setPage(finalPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ New: submit go-to-page
  function handleGoToSubmit(e) {
    e.preventDefault();

    const n = parseInt(gotoValue, 10);
    if (Number.isNaN(n)) {
      toast.error("Enter a valid page number");
      return;
    }

    if (totalPages > 0 && (n < 1 || n > totalPages)) {
      toast.error(`Page must be between 1 and ${totalPages}`);
      return;
    }

    if (n < 1) {
      toast.error("Page must be 1 or greater");
      return;
    }

    goToPage(n);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />

      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem?._id || productItem?.id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>

        {/* ✅ Pagination + Go to Page */}
        <div className="p-4 border-t flex flex-col gap-3 items-center justify-center">
          {(totalPages > 1 || canNext) && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => goToPage(currentPage - 1)}
                disabled={!canPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {pageItems.map((item, idx) => {
                  if (item === "...") {
                    return (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 text-sm text-muted-foreground"
                      >
                        …
                      </span>
                    );
                  }

                  const isActive = item === currentPage;

                  return (
                    <button
                      key={`page-${item}`}
                      type="button"
                      onClick={() => goToPage(item)}
                      className={[
                        "h-9 min-w-9 rounded-md px-3 text-sm transition-colors",
                        "border",
                        isActive
                          ? "bg-background shadow-sm font-semibold"
                          : "bg-transparent hover:bg-muted",
                      ].join(" ")}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => goToPage(currentPage + 1)}
                disabled={
                  !canNext || (totalPages > 0 && currentPage >= totalPages)
                }
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* ✅ New: Go to page input */}
          <form
            onSubmit={handleGoToSubmit}
            className="flex items-center gap-2"
          >
            <label className="text-sm text-muted-foreground" htmlFor="gotoPage">
              Go to page
            </label>

            <input
              id="gotoPage"
              type="number"
              inputMode="numeric"
              min={1}
              max={totalPages > 0 ? totalPages : undefined}
              value={gotoValue}
              onChange={(e) => setGotoValue(e.target.value)}
              className="h-9 w-20 rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="1"
            />

            <Button type="submit" variant="outline" size="sm">
              Go
            </Button>

            {totalPages > 0 ? (
              <span className="text-sm text-muted-foreground">
                / {totalPages}
              </span>
            ) : null}
          </form>
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
