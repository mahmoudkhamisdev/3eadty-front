import {
  Activity,
  AlertCircle,
  Check,
  Heart,
  PenSquare,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FaFemale, FaMale } from "react-icons/fa";
import { TbUserEdit } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostData } from "../..//api/Axios/usePostData";
import { DeleteData } from "../../api/Axios/useDeleteData";
import { EditData } from "../../api/Axios/useEditData";
import { GetDataToken } from "../../api/Axios/useGetData";
import UserDataLoader from "../../components/PageLoader/UserDataLoader/UserDataLoader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { DateFormate } from "../../utils/Dates/DateFormate";
import notify from "../../utils/useToastify";
import AppointmentsTab from "../Tabs/AppointmentsTab";
import CurrentMedicationsTab from "../Tabs/CurrentMedicationsTab";
import RadiographsTab from "../Tabs/RadiographsTab";
import TreatmentsDetailsTab from "../Tabs/TreatmentsDetailsTab";
import TreatmentsHistoryTab from "../Tabs/TreatmentsHistoryTab";
import TreatmentsPlanTab from "../Tabs/TreatmentsPlanTab";
import "./PatientsDetails.css";
import { FaWhatsapp } from "react-icons/fa6";

const PatientsDetails = ({ allAppointment }) => {
  const { id } = useParams(); /* User ID */
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get User //
  const [user, setUser] = useState("");
  const [isPaid, setIsPaid] = useState();

  const GetUser = () => {
    setLoading(true);

    GetDataToken(`/api/v1/userInfo/${id}`)
      .then((res) => {
        setUser(res.data);
        setIsPaid(res.data.data.isPaid);
        setAllNotes(res.data.data.clinicalExamination);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/");
        notify(
          err.response.data.msg ||
            err.response.data.message ||
            err.response.data.errors[0].msg,
          "error"
        );
      });
  };

  useEffect(() => {
    GetUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateIsPaidOrNot = (value) => {
    if (value === true) {
      PostData(`/api/v1/userInfo/paid/${id}`)
        .then(() => {
          notify("تم الدفع بنجاح", "success");
          GetUser();
        })
        .catch((err) => {
          console.log(err);
          notify(
            err.response.data.msg ||
              err.response.data.message ||
              err.response.data.errors[0].msg,
            "error"
          );
        });
    } else {
      PostData(`/api/v1/userInfo/notPaid/${id}`)
        .then(() => {
          notify("تم الغاء الدفع", "warn");
          GetUser();
        })
        .catch((err) => {
          console.log(err);
          notify(
            err.response.data.msg ||
              err.response.data.message ||
              err.response.data.errors[0].msg,
            "error"
          );
        });
    }
  };

  // Notes //
  const [allNotes, setAllNotes] = useState([]);
  const [noteName, setNoteName] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  const handleAddNotes = (e) => {
    e.preventDefault();

    PostData(`api/v1/examination/${id}`, {
      notes: noteName,
    })
      .then(() => {
        notify("تمت الاضافة بنجاح", "success");
        GetUser();
        setNoteName();
      })
      .catch((err) => {
        console.log(err);
        notify(
          err.response.data.msg ||
            err.response.data.message ||
            err.response.data.errors[0].msg,
          "error"
        );
      });
  };

  const handleDeleteNotes = (e, noteId) => {
    e.preventDefault();

    DeleteData(`api/v1/examination/${id}`, {
      docId: noteId,
    })
      .then(() => {
        notify("تم الحذف", "warn");
        GetUser();
      })
      .catch((err) => {
        console.log(err);
        notify(
          err.response.data.msg ||
            err.response.data.message ||
            err.response.data.errors[0].msg,
          "error"
        );
      });
  };

  const handleNoteChange = (noteId, newValue) => {
    setAllNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId ? { ...note, notes: newValue } : note
      )
    );
  };

  const handleEditNotes = (e, noteId) => {
    e.preventDefault();
    const noteToEdit = allNotes.find((note) => note._id === noteId);
    if (!noteToEdit) return;

    EditData(`api/v1/examination/${id}`, {
      docId: noteId,
      notes: noteToEdit.notes,
    })
      .then(() => {
        notify("تم التعديل بنجاح", "success");
        setEditingNoteId(null);
        GetUser();
      })
      .catch((err) => {
        console.log(err);
        notify(
          err.response.data.msg ||
            err.response.data.message ||
            err.response.data.errors[0].msg,
          "error"
        );
      });
  };

  // Edit User //
  const [isOpen, setIsOpen] = useState();

  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();
  const [price, setPrice] = useState();
  const [paid, setPaid] = useState();
  const [medicalConditions, setMedicalConditions] = useState();
  const [allergies, setAllergies] = useState();
  const [currentComplaints, setCurrentComplaints] = useState();
  const [recommendations, setRecommendations] = useState();

  const handleShowEdit = () => {
    setName(user.data.name);
    setGender(user.data.gender);
    setAge(user.data.age);
    setPhone(user.data.phone);
    setPrice(user.data.price);
    setPaid(user.data.paid);
    setMedicalConditions(user.data.medicalConditions);
    setAllergies(user.data.allergies);
    setCurrentComplaints(user.data.currentComplaints);
    setRecommendations(user.data.recommendations);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();

    EditData(`/api/v1/userInfo/${id}`, {
      name,
      gender,
      age,
      phone,
      price,
      paid,
      medicalConditions,
      allergies,
      currentComplaints,
      recommendations,
    })
      .then((res) => {
        notify("تم التعديل بنجاح", "success");
        GetUser();
        setIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        notify(
          err.response.data.msg ||
            err.response.data.message ||
            err.response.data.errors[0].msg,
          "error"
        );
      });
  };

  return !loading && user.data ? (
    <Row>
      {/* Title */}
      <div className="d-flex gap-1 align-items-center mb-1">
        <TbUserEdit size={40} className="main-color" />
        <div className="fs-2 p-0">{user.data.name}</div>
      </div>
      {/* BreadcrumbLink & EditBtn */}
      <div className="d-flex gap-2 flex-wrap align-items-center justify-content-between mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/patients">كل المرضي</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>تفاصيل المريض</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger className="transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <span
              className="btn bg-color text-light fw-bold py-2 px-4 shadow"
              onClick={handleShowEdit}
            >
              تعديل مريض
            </span>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="fs-2">احمد خميس</DrawerTitle>
              <DrawerDescription>إجراءات تعديل المريض</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="">
              <Row>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center m-auto gap-2"
                >
                  <Row className="gap-2 px-2">
                    <Col className="p-0">
                      <Input
                        type="text"
                        placeholder="اسم المريض"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Col>
                    <Col className="p-0">
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="w-100">
                          <SelectValue placeholder="النوع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="male">ذكر</SelectItem>
                            <SelectItem value="female">انثي</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Col>
                  </Row>
                  <Row className="gap-2 px-2">
                    <Col className="p-0">
                      <Input
                        type="number"
                        placeholder="العمر"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </Col>
                    <Col className="p-0">
                      <Input
                        type="number"
                        placeholder="رقم الهاتف"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="gap-2 px-2">
                    <Col className="p-0">
                      <Input
                        type="number"
                        placeholder="السعر"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </Col>
                    <Col className="p-0">
                      <Input
                        type="number"
                        placeholder="المدفوع حاليا"
                        value={paid}
                        onChange={(e) => setPaid(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="gap-2 px-2">
                    <Col className="p-0">
                      <Input
                        type="text"
                        placeholder="الحالة الطبية"
                        value={medicalConditions}
                        onChange={(e) => setMedicalConditions(e.target.value)}
                      />
                    </Col>
                    <Col className="p-0">
                      <Input
                        type="text"
                        placeholder="الحساسية"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row className="gap-2 px-2">
                    <Input
                      type="text"
                      placeholder="الشكاوي الحالية"
                      value={currentComplaints}
                      onChange={(e) => setCurrentComplaints(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="توصيات الدكتور للمريض"
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                    />
                  </Row>
                  <div className="d-flex flex-wrap gap-2 justify-content-between">
                    <DrawerClose>
                      <Button variant="outline">الغاء</Button>
                    </DrawerClose>
                    <Button
                      variant="default"
                      onClick={(e) => handleUpdateUser(e)}
                    >
                      تعديل
                    </Button>
                  </div>
                </Col>
              </Row>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Cards Info */}
      <Col md={8} className="patient-details d-flex flex-column gap-3 p-2">
        <Row className="d-flex flex-wrap align-items-center card-user-info">
          <Col md="5" className="p-0 px-2">
            <Card className="h-[290px] text-center p-6 pt-0 text-nowrap">
              <CardHeader className="items-center overflow-auto">
                <Avatar style={{ width: "7rem", height: "7rem" }}>
                  <AvatarImage src="#" alt="محمود" />
                  <AvatarFallback className="text-muted fs-5">
                    {user.data.gender === "male" ? (
                      <FaMale size={55} className="text-blue-500" />
                    ) : (
                      <FaFemale size={55} className="text-pink-500" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.data.name}</CardTitle>
                <CardDescription>{user.data.slug}</CardDescription>
              </CardHeader>
              <CardFooter className="p-0 pt-3">
                <Select
                  value={isPaid}
                  onValueChange={(value) => {
                    setIsPaid(value);
                    handleUpdateIsPaidOrNot(value);
                  }}
                >
                  <SelectTrigger className="w-100">
                    <SelectValue placeholder="حالة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={true}>مدفوع</SelectItem>
                      <SelectItem value={false}>مستحق</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardFooter>
            </Card>
          </Col>
          <Col md="7" className="p-0 px-2">
            <Card className="h-[290px] p-6">
              <div className="d-flex">
                <Col>
                  <p className="m-0 text-muted fw-bold fs-6">النوع</p>
                  <p className="m-0">
                    {user.data.gender === "male" ? "ذكر" : "انثي" || "لا يوجد"}
                  </p>
                </Col>
                <Col>
                  <p className="m-0 text-muted fw-bold fs-6">العمر</p>
                  <p className="m-0">{user.data.age || "لا يوجد"}</p>
                </Col>
              </div>
              <div className="border-t my-4" />
              <div className="d-flex">
                <Col>
                  <p className="m-0 text-muted fw-bold fs-6">الهاتف</p>
                  <a
                    href={`https://wa.me/20${user.data?.phone}`}
                    className="m-0 flex items-center gap-x-1"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.data.phone || "لا يوجد"}
                    <FaWhatsapp size={20} color="green" />
                  </a>
                </Col>
                <Col>
                  <p className="m-0 text-muted fw-bold fs-6">السعر</p>
                  <p className="m-0">{user.data.price || "لا يوجد"}</p>
                </Col>
              </div>
              <div className="border-t my-4" />
              <div className="d-flex">
                <Col>
                  <p className="m-0 text-muted fw-bold fs-6">المدفوع</p>
                  <p className="m-0">{user.data.paid || "لا يوجد"}</p>
                </Col>
                <Col>
                  {user.data.paidAt ? (
                    <>
                      <p className="m-0 text-muted fw-bold fs-6">تم الدفع</p>
                      <p className="m-0">
                        {DateFormate(user.data.paidAt) || "لا يوجد"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="m-0 text-muted fw-bold fs-6">المتبقي</p>
                      <p className="m-0">
                        {user.data.restOfPrice || "لا يوجد"}
                      </p>
                    </>
                  )}
                </Col>
              </div>
            </Card>
          </Col>
        </Row>

        <Card className="w-full">
          <Tabs
            defaultValue={localStorage.getItem("TabName") || "appointments"}
            className="p-4"
            style={{ direction: "rtl" }}
            onValueChange={(e) => localStorage.setItem("TabName", e)}
          >
            <TabsList className="tabs-list w-full grid">
              <TabsTrigger value="appointments">المواعيد</TabsTrigger>
              <TabsTrigger value="allCurrentMedications">الادوية</TabsTrigger>
              <TabsTrigger value="allRadiographs">الاشعة</TabsTrigger>
              <TabsTrigger value="allTreatmentsHistory">
                تاريخ المرض
              </TabsTrigger>
              <TabsTrigger value="allTreatmentsPlan">خطة علاج</TabsTrigger>
              <TabsTrigger value="allTreatmentsDetails">
                تفاصيل العلاج
              </TabsTrigger>
            </TabsList>
            <TabsContent value="appointments" className="text-end">
              <AppointmentsTab
                user={user.data}
                allAppointment={allAppointment}
              />
            </TabsContent>
            <TabsContent value="allCurrentMedications">
              <CurrentMedicationsTab
                user={user.data.currentMedications}
                GetUser={GetUser}
              />
            </TabsContent>
            <TabsContent value="allRadiographs">
              <RadiographsTab user={user.data.radiographs} GetUser={GetUser} />
            </TabsContent>
            <TabsContent value="allTreatmentsHistory">
              <TreatmentsHistoryTab
                user={user.data.treatmentsHistory}
                GetUser={GetUser}
              />
            </TabsContent>
            <TabsContent value="allTreatmentsPlan">
              <TreatmentsPlanTab
                user={user.data.treatmentsPlan}
                GetUser={GetUser}
              />
            </TabsContent>
            <TabsContent value="allTreatmentsDetails">
              <TreatmentsDetailsTab
                user={user.data.treatmentsDetails}
                GetUser={GetUser}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </Col>
      {/* Medical And Notes */}
      <Col md={4} className="d-flex flex-column gap-3 p-2">
        {/* Notes */}
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle>الملاحظات</CardTitle>
            <CardDescription>إضافة ملاحظة جديدة للمريض</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {allNotes.map((note) => (
              <div
                key={note._id}
                className="flex items-center justify-between gap-2"
              >
                <Input
                  value={note.notes}
                  onChange={(e) => handleNoteChange(note._id, e.target.value)}
                  readOnly={editingNoteId !== note._id}
                />
                {editingNoteId === note._id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleEditNotes(e, note._id)}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingNoteId(note._id)}
                  >
                    <PenSquare className="h-4 w-4 text-green-700" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => handleDeleteNotes(e, note._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Input
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
              placeholder="اكتب الملاحظات هنا..."
            />
          </CardContent>
          <CardFooter>
            <Button value={noteName} onClick={(e) => handleAddNotes(e)}>
              اضافة ملاحظة
            </Button>
          </CardFooter>
        </Card>
        {/* MedicalCard */}
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              الملف الطبي الشخصي
            </CardTitle>
            <CardDescription>
              ملخص الحالة الصحية والمعلومات الطبية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-semibold">الحالات الطبية:</p>
                <p className="text-muted">
                  {user.data.medicalConditions || "لا يوجد"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <AlertCircle className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-semibold">الحساسية:</p>
                <p className="text-muted">{user.data.allergies || "لا يوجد"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Activity className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-semibold">الشكاوى الحالية:</p>
                <p className="text-muted">
                  {user.data.currentComplaints || "لا يوجد"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Stethoscope className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold">توصيات الدكتور:</p>
                <p className="text-muted">
                  {user.data.recommendations || "لا يوجد"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Col>
    </Row>
  ) : (
    <div className="d-flex justify-content-center align-items-center h-100 bg-main">
      <UserDataLoader />
    </div>
  );
};

export default PatientsDetails;
