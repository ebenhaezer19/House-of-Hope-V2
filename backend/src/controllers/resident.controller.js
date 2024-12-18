const createResident = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);
    
    // Parse data resident
    const residentData = JSON.parse(req.body.data);
    console.log('Parsed resident data:', residentData);

    // Proses file foto
    let photoDocument = null;
    if (req.files.photo) {
      const photo = req.files.photo[0];
      photoDocument = {
        name: photo.filename,
        path: `/uploads/${photo.filename}`,
        type: 'photo'
      };
    }

    // Proses dokumen pendukung
    const supportingDocuments = req.files.documents?.map(doc => ({
      name: doc.filename,
      path: `/uploads/${doc.filename}`,
      type: 'document'
    })) || [];

    // Gabungkan semua dokumen
    const documents = photoDocument ? [photoDocument, ...supportingDocuments] : supportingDocuments;

    // Buat resident dengan dokumen
    const resident = await prisma.resident.create({
      data: {
        ...residentData,
        documents: {
          create: documents
        }
      },
      include: {
        documents: true,
        room: true
      }
    });

    res.status(201).json(resident);
    
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(500).json({ 
      message: 'Terjadi kesalahan saat memproses data',
      error: error.message
    });
  }
}; 