import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { 
  Paper, Typography, Button, Grid, Chip, CircularProgress, Box, Breadcrumbs, Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Food } from '../../models/Food';
import { getFoodById } from '../../services/foodService';
import '../../styles/FoodDetail.css';

const FoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFood = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const foodData = await getFoodById(id);
        if (foodData) {
          setFood(foodData);
          setError(null);
        } else {
          setError('Không tìm thấy thông tin món ăn');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin món ăn');
        console.error('Error loading food:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  const handleBack = () => {
    navigate('/foods');
  };

  const handleEdit = () => {
    if (food) {
      navigate(`/foods/${food.id}/edit`);
    }
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hiển thị trạng thái món ăn
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip label="Đang bán" color="success" />;
      case 'OUT_OF_STOCK':
        return <Chip label="Hết hàng" color="warning" />;
      case 'INACTIVE':
        return <Chip label="Ngừng bán" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  // Format ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="food-detail-container">
        <Breadcrumbs aria-label="breadcrumb" className="food-detail-breadcrumbs">
          <Link color="inherit" href="/dashboard">
            Trang chủ
          </Link>
          <Link color="inherit" href="/foods">
            Quản lý món ăn
          </Link>
          <Typography color="textPrimary">Chi tiết món ăn</Typography>
        </Breadcrumbs>

        <div className="food-detail-header">
          <Typography variant="h5" component="h1">
            Chi tiết món ăn
          </Typography>
          <div className="food-detail-actions">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="back-button"
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="error-container">
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={handleBack}>
              Quay lại danh sách
            </Button>
          </div>
        ) : food ? (
          <Paper className="food-detail-content">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <div className="food-image-container">
                  <img
                    src={food.image || 'https://dummyimage.com/350x350/cccccc/ffffff&text=No+Image'}
                    alt={food.name}
                    className="food-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://dummyimage.com/350x350/cccccc/ffffff&text=No+Image';
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {food.name}
                </Typography>
                
                <div className="food-info-item">
                  <Typography variant="subtitle1" component="span" className="food-info-label">
                    Mã SKU:
                  </Typography>
                  <Typography variant="body1" component="span">
                    {food.sku}
                  </Typography>
                </div>
                
                <div className="food-info-item">
                  <Typography variant="subtitle1" component="span" className="food-info-label">
                    Loại:
                  </Typography>
                  <Typography variant="body1" component="span">
                    {food.category}
                  </Typography>
                </div>
                
                <div className="food-info-item">
                  <Typography variant="subtitle1" component="span" className="food-info-label">
                    Giá:
                  </Typography>
                  <Typography variant="body1" component="span" className="food-price">
                    {formatPrice(food.price)}
                  </Typography>
                </div>
                
                <div className="food-info-item">
                  <Typography variant="subtitle1" component="span" className="food-info-label">
                    Trạng thái:
                  </Typography>
                  {renderStatus(food.status)}
                </div>
                
                {food.description && (
                  <div className="food-description">
                    <Typography variant="subtitle1" component="h3" gutterBottom>
                      Mô tả:
                    </Typography>
                    <Typography variant="body1" component="p">
                      {food.description}
                    </Typography>
                  </div>
                )}
                
                <Box mt={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <div className="food-info-item">
                        <Typography variant="subtitle2" component="span" className="food-info-label">
                          Ngày tạo:
                        </Typography>
                        <Typography variant="body2" component="span">
                          {formatDate(food.createdAt)}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="food-info-item">
                        <Typography variant="subtitle2" component="span" className="food-info-label">
                          Cập nhật lần cuối:
                        </Typography>
                        <Typography variant="body2" component="span">
                          {formatDate(food.updatedAt)}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ) : null}
      </div>
    </Layout>
  );
};

export default FoodDetail; 