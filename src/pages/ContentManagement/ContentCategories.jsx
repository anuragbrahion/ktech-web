import React, { useEffect, useState } from "react";
import TableData from "../../components/Atoms/Table";
import { useDispatch, useSelector } from "react-redux";
import { contentCategories, createContentCategories, deleteContentCategories, enableDisableContentCategories, settingsGlobal, updateContentCategories } from "../../redux/slices/AdminSlice";
import { formatDateForDisplay } from "../../utils/globalFunction";
import DeleteIcon from "../../components/Icons/DeleteIcon";
import EditIcon from "../../components/Icons/EditIcon";
import Toggle from "../../components/Atoms/Toggle";
import AlertModal from "../../components/Modal/AlertModal";
import { toast } from "react-toastify";
import { AddButton } from "../../components/Atoms/buttons/AllButtons";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import Dropdown from "../../components/DropDown";
import Input from "../../components/Input/Input";
import Button from "../../components/Atoms/Button";
import Loader from "../../components/Loader/Loader";
import SearchInput from "../../components/SearchInput/SearchInput";

const ContentCategories = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [deleteModal, setIsDeleteModal] = useState(false)
  const [deleteData, setDeleteData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isRefresh, setIsRefresh] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})
  const [keyWord, setKeyWord] = useState("")

  const size = 10

  useEffect(() => {
    const reqData = {
      keyWord: keyWord,
      page: page,
      size: size
    }
    dispatch(contentCategories(reqData))
  }, [isRefresh, page, keyWord])

  useEffect(() => {
    dispatch(settingsGlobal())
  }, [])

  const selector = useSelector((state) => state.admin)
  const contentCategoriesData = selector?.contentCategoriesData?.data?.data
  const settingsGlobalData = selector?.settingsGlobalData?.data?.data
  const DARA_AGE_RANGES = settingsGlobalData?.DARA_AGE_RANGES
  const DARA_DEFAULT_LANGUAGE = settingsGlobalData?.DARA_DEFAULT_LANGUAGE;
  const DARA_SUPPORTED_LANGUAGES = settingsGlobalData?.DARA_SUPPORTED_LANGUAGES;

  const mergedLanguages = [
    DARA_DEFAULT_LANGUAGE,
    ...(Array.isArray(DARA_SUPPORTED_LANGUAGES) ? DARA_SUPPORTED_LANGUAGES : [])
  ];

  const newLanguageArray = mergedLanguages?.map(lang => ({
    label: lang?.name,
    value: lang?.code
  })) || [];

  // Initial form state
  const initialFormState = {
    title: "",
    languages: [],
    ageRanges: [],
    bleCompatible: false,
    translations: []
  };

  const [formData, setFormData] = useState(initialFormState);
  useEffect(() => {
    if (formData.languages.length > 0) {
      const newTranslations = formData.languages.map(langCode => {
        const existingTranslation = formData.translations.find(t => t.language === langCode);
        const langInfo = newLanguageArray.find(lang => lang.value === langCode);
        const langName = langInfo?.label || langCode;

        return existingTranslation || {
          language: langCode,
          title: "",
          keywords: "",
          placeholder: langName
        };
      });
      const filteredTranslations = newTranslations.filter(t =>
        formData.languages.includes(t.language)
      );

      setFormData(prev => ({
        ...prev,
        translations: filteredTranslations
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        translations: []
      }));
    }
  }, [formData.languages]);

  const handlePageChange = (data) => {
    setPage(data)
  }

  const handleDeleteOpen = (data) => {
    setIsDeleteModal(true)
    setDeleteData(data._id)
  }

  const handleCancelAction = () => {
    setIsDeleteModal(false)
  }

  const handleConfirmDelete = () => {
    setIsLoading(true)
    dispatch(deleteContentCategories({ _id: deleteData })).unwrap()
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
        } else {
          setIsDeleteModal(false);
          toast.success(res.message || "Item Deleted Successfully");
          setIsRefresh(!isRefresh);
        }
      }).catch((error) => {
        toast.error(error);
      }).finally(() => {
        setIsLoading(false)
      });
  };

  const handleOpenAdd = () => {
    setIsEditMode(false)
    setEditingId(null)
    setFormData(initialFormState)
    setErrors({})
    setIsOpenModal(true)
  }

  const handleOpenEdit = (item) => {
    setIsEditMode(true)
    setEditingId(item._id)

    // Transform the API data to match our form structure
    const transformedData = {
      title: item.title || "",
      languages: item.languages || [],
      ageRanges: item.ageRanges || [],
      bleCompatible: item.bleCompatible || false,
      translations: item.translations || []
    };

    setFormData(transformedData)
    setErrors({})
    setIsOpenModal(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleTranslationChange = (language, field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(translation =>
        translation.language === language
          ? { ...translation, [field]: value }
          : translation
      )
    }));

    // Clear translation errors
    const errorKey = `translations.${language}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validations
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.languages?.length) {
      newErrors.languages = "At least one language is required";
    }

    if (!formData.ageRanges?.length) {
      newErrors.ageRanges = "At least one age range is required";
    }

    // Translation validations
    formData.translations.forEach(translation => {
      if (!translation.title?.trim()) {
        newErrors[`translations.${translation.language}.title`] = `${translation.placeholder} title is required`;
      }

      if (!translation.keywords?.trim()) {
        newErrors[`translations.${translation.language}.keywords`] = `${translation.placeholder} keywords are required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare the data for API
    const submitData = {
      title: formData.title.trim(),
      languages: formData.languages,
      ageRanges: Array(formData.ageRanges),
      bleCompatible: formData.bleCompatible,
      translations: formData.translations.map(t => ({
        language: t.language,
        title: t.title.trim(),
        keywords: t.keywords.trim()
      }))
    };

    // Add ID for update
    if (isEditMode) {
      submitData._id = editingId;
    }

    const apiCall = isEditMode ? updateContentCategories : createContentCategories;

    dispatch(apiCall(submitData)).unwrap()
      .then((res) => {
        if (res.error) {
          toast.error(res.message || "Operation failed");
        } else {
          toast.success(res.message ||
            `Content Category ${isEditMode ? 'Updated' : 'Created'} Successfully`
          );
          setIsOpenModal(false);
          setIsRefresh(!isRefresh);
        }
      }).catch((error) => {
        console.log("error", error);
        toast.error(error || `Error in ${isEditMode ? 'Updating' : 'Creating'} Content Category`);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const getLanguageName = (languageCode) => {
    const lang = newLanguageArray.find(l => l.value === languageCode);
    return lang?.label || languageCode;
  };
  const getLanguageLabels = (codes = []) =>
    codes.map(code => {
      const lang = mergedLanguages.find(l => l.code === code);
      return lang ? lang.name : code;
    });
  const getAgeRangeLabels = (ranges = []) =>
    ranges.map(range => {
      const match = DARA_AGE_RANGES.find(a => a.value === range);
      return match ? match.label : range;
    });
     const handleToggle = (data) => {
            const reqData = {
                _id: data._id,
                isDisable: data.isDisable ? false : true
            };
            setIsLoading(true);
            dispatch(enableDisableContentCategories(reqData))
                .unwrap()
                .then((res) => {
                    toast.success(res.message || "Status updated successfully");
                    setIsRefresh(!isRefresh);
                })
                .catch((error) => {
                    toast.error(error || "Error updating status");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };
  return (
    <>
      <Loader loading={selector?.loading || isLoading} />
      <div className="min-h-[calc(100vh-80px)] overflow-y-auto bg-white p-4 md:p-6 lg:p-8 relative">
        <div className="flex justify-between mb-4">
          <SearchInput
            type="text"
            placeholder="Search By Title"
            value={keyWord}
            onChange={(e) => {
              setKeyWord(e.target.value);
            }}
            className="w-[1/2]"
          />

          <AddButton text="Add New" onClick={handleOpenAdd} />
        </div>

        <TableData
          tableHeadings={[
            '#',
            'Title',
            'Action By',
            'Age Range',
            'Language',
            'BLE Compatible',
            'Last Modified At',
            'Status',
            'Action'
          ]}
          data={contentCategoriesData?.list?.map((item, index) => [
            <span key={`sno-${index}`}>{((page - 1) * size) + (index + 1)}</span>,
            <span>{item?.title}</span>,
            <span >
              <h1 className="capitalize">{item?.actionBy?.username}</h1>
              <h1 className="text-gray-300">{item?.actionBy?.email}</h1>
            </span>,
            <div className="flex flex-col gap-1 ml-2">
              {getLanguageLabels(item.languages).map((lang, idx) => (
                <span key={idx} className="text-sm text-gray-700">
                  {lang}
                </span>
              ))}
            </div>,
            <div className="flex flex-col gap-1 ml-2">
              {getAgeRangeLabels(item.ageRanges).map((lang, idx) => (
                <span key={idx} className="text-sm text-gray-700">
                  {lang}
                </span>
              ))}
            </div>,
            <span>{item?.bleCompatible ? "Yes" : "No"}</span>,
            <span>{formatDateForDisplay(item?.updatedAt)}</span>,
            <div key={`status-${item._id}`}>
              <Toggle
                id={`toggle-${item._id}`}
                label=""
                isChecked={!item.isDisable}
                onToggle={() => handleToggle(item)}
                isDisabled={isLoading}
              />
            </div>,
            <div className="flex gap-2">
              <EditIcon
                tooltip='Edit'
                onClickFunction={() => { handleOpenEdit(item) }}
              />
              <DeleteIcon
                tooltip='Delete'
                onClickFunction={() => { handleDeleteOpen(item) }}
              />
            </div>
          ])}
          total={contentCategoriesData?.list?.total}
          currentPage={page}
          handlePageChange={handlePageChange}
          size={size}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal}
        onCancel={handleCancelAction}
        onConfirm={handleConfirmDelete}
        title="Remove Item"
        description="Are You Sure You Want To Delete?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        imageUrl="/icons/delete.svg"
        imageClassName="w-10 h-10"
        isVisibleConfirmButton={true}
        isVisibleCancelButton={true}
        cancelClassNameButton="!bg-gray-300"
        confirmClassNameButton="!bg-red-500"
      />

      {/* Add/Edit Modal */}
      <DefaultPreviewModal
        heading={isEditMode ? "Edit Content Category" : "Create Content Category"}
        closeModal={() => setIsOpenModal(false)}
        isOpen={isOpenModal}
        handleSubmit={handleSubmit}
        showCancelButton={true}
        showSubmitButton={true}
      >
        <div className="space-y-4">
          {/* Basic Information */}
          <Input
            label="Title"
            name="title"
            maxLength={50}
            value={formData.title}
            placeholder="Enter Title"
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropdown
              label="Age Range"
              name="ageRanges"
              value={formData.ageRanges}
              options={DARA_AGE_RANGES}
              onChange={(selectedOption) => handleInputChange("ageRanges", selectedOption.value)}
              error={errors.ageRanges}
              required
            />

            <Dropdown
              label="Language"
              name="languages"
              isMulti
              value={formData.languages?.map(lang => ({ value: lang, label: getLanguageName(lang) })) || []}
              options={newLanguageArray}
              onChange={(selectedOptions) => handleInputChange("languages", selectedOptions?.map(opt => opt.value) || [])}
              error={errors.languages}
              required
            />
          </div>

          {/* Translations Section */}
          {formData.translations.length > 0 && (
            <div className="mt-6">
              <label className="font-semibold text-lg block mb-4">Translations</label>
              <div className="space-y-4">
                {formData.translations.map((translation, index) => (
                  <div key={translation.language} className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-3 capitalize">{translation.placeholder} Translation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        label="Title"
                        value={translation.title}
                        placeholder={`Enter ${translation.placeholder} title`}
                        onChange={(e) => handleTranslationChange(translation.language, "title", e.target.value)}
                        error={errors[`translations.${translation.language}.title`]}
                        required
                      />
                      <Input
                        label="Keywords"
                        value={translation.keywords}
                        placeholder={`Enter ${translation.placeholder} keywords`}
                        onChange={(e) => handleTranslationChange(translation.language, "keywords", e.target.value)}
                        error={errors[`translations.${translation.language}.keywords`]}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLE Compatible */}
          <div className="mt-4">
            <Dropdown
              label="BLE Compatible"
              name="bleCompatible"
              value={formData.bleCompatible ?
                { value: true, label: "Yes" } :
                { value: false, label: "No" }
              }
              options={[
                { value: true, label: "Yes" },
                { value: false, label: "No" }
              ]}
              onChange={(selectedOption) => handleInputChange("bleCompatible", selectedOption.value)}
            />
          </div>
        </div>
      </DefaultPreviewModal>
    </>
  )
}

export default ContentCategories