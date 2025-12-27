import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  // ✅ NEW: pagination state
  const [page, setPage] = useState(1);
  const limit = 8;

  const { productList, pagination } = useSelector(
    (state) => state.adminProducts
  );

  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    if (imageLoadingState) return;

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: {
            ...formData,
            image: uploadedImageUrl || formData.image,
          },
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts({ page, limit })); // ✅ UPDATED
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setImageFile(null);
          setUploadedImageUrl("");
          toast.success("Product updated successfully");
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // ✅ After adding new product, go back to page 1 (common admin UX)
          setPage(1);
          dispatch(fetchAllProducts({ page: 1, limit }));
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setUploadedImageUrl("");
          setFormData(initialFormData);
          toast.success("Product added successfully");
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        // ✅ If current page becomes invalid after delete, move one page back safely
        const totalPages = pagination?.totalPages || 1;
        const nextPage = page > totalPages ? Math.max(totalPages, 1) : page;

        setPage(nextPage);
        dispatch(fetchAllProducts({ page: nextPage, limit }));
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => !["averageReview", "image"].includes(key))
      .every((key) => String(formData[key]).trim() !== "");
  }

  const isBtnDisabled = useMemo(() => {
    return (
      !isFormValid() ||
      imageLoadingState ||
      (currentEditedId === null && !uploadedImageUrl)
    );
  }, [formData, imageLoadingState, currentEditedId, uploadedImageUrl]);

  // ✅ UPDATED: fetch with pagination
  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit }));
  }, [dispatch, page]);

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || page;
  const canPrev = currentPage > 1;
  const canNext = pagination?.hasNextPage ?? currentPage < totalPages;

  return (
    <Fragment>
      <div className="mb-5 flex w-full justify-end cursor-pointer">
        <Button onClick={() => setOpenCreateProductsDialog(true)} type="button">
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.length
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem?._id || productItem?.id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                setUploadedImageUrl={setUploadedImageUrl}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      {/* ✅ NEW: Pagination UI (minimal, no layout break) */}
      {totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={!canPrev}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!canNext}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(isOpen) => {
          setOpenCreateProductsDialog(isOpen);

          if (!isOpen) {
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadedImageUrl("");
            setImageLoadingState(false);
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="p-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={isBtnDisabled}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
